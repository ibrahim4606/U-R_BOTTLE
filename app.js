const express = require("express");
const app = express();
require("dotenv").config();
const genai = require("@google/genai");
const mongoose = require("mongoose");
const User = require("./models/users.js");
const AiDesign = require("./models/aigenerate.js");
const SaveAiDesign = require("./models/saveaigenerate.js");
const Cart = require("./models/cart.js");
const Order = require("./models/orders.js");
const Review = require("./models/review.js");
const Pricing = require("./models/pricings.js");
const Contact = require("./models/contact.js");
const schemas = require("./utils/joi_schema_validation.js"); // adjust path if needed
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ai = new genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const multer = require("multer");
// const fs = require("fs");
// project ppt time
const { storage } = require("./utils/cloudConfig.js");
const upload = multer({ storage });
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const bcrypt = require("bcrypt");
const flash = require("connect-flash");
const sendMail = require("./utils/mail.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

main()
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL, // ✅ important
    }),

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: true, // 🔥 important for production
    },
  }),
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user;
  next();
});

// login middleware
const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    req.flash("error", "Please login first to place order");

    return res.redirect("/login");
  }

  next();
};

// admin login middleware
const isAdmin = (req, res, next) => {
  if (!req.session.admin) {
    req.flash("error", "Please Login First For access of Admin");
    return res.redirect("/admin");
  }

  next();
};

// ---------------- JOI VALIDATION MIDDLEWARE ----------------
const validate = (schemaName, key = null) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      req.flash("error", "Validation schema not found");
      return res.redirect("/home");
    }

    const data = key ? req.body[key] : req.body;

    const { error } = schema.validate(data);

    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      req.flash("error", msg);
      return res.redirect("/home");
    }

    next();
  };
};

// multer upload function

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = "public/uploads";

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     cb(null, dir);
//   },

//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

app.get("/", (req, res) => {
  res.redirect("/home");
});

// admin logic start

app.get("/admin", (req, res) => {
  res.render("admin/login.ejs");
});

app.post("/admin/login", (req, res, next) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return next(
      new ExpressError(403, "Password incorrect and you don't have access"),
    );
  }

  req.session.admin = true;

  res.redirect("/admin/dashboard");
});

app.get("/admin/logout", (req, res) => {
  req.session.admin = null;

  req.flash("success", "Admin logged out");

  res.redirect("/home");
});

app.get(
  "/admin/dashboard",
  isAdmin,
  wrapAsync(async (req, res) => {
    const orders = await Order.find({})
      .populate("user") // 🔥 get full user details
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments();

    const inProgress = await Order.countDocuments({
      orderStatus: "In Progress",
    });

    const delivered = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const rejected = await Order.countDocuments({
      orderStatus: "Rejected",
    });

    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenue[0] ? revenue[0].total : 0;

    res.render("admin/dashboard.ejs", {
      orders,
      totalOrders,
      inProgress,
      delivered,
      rejected,
      totalRevenue,
    });
  }),
);

app.post(
  "/admin/order/:id",
  isAdmin,
  wrapAsync(async (req, res) => {
    const { status, rejectReason } = req.body;

    const updateData = { orderStatus: status };

    if (status === "Rejected") {
      updateData.rejectReason = rejectReason;
    }

    await Order.findByIdAndUpdate(req.params.id, updateData);

    req.flash("success", "Order status updated");

    res.redirect("/admin/dashboard");
  }),
);

// admin logic end

// signup
app.get("/signup", (req, res) => {
  res.render("pages/signup.ejs");
});

// login
app.get("/login", (req, res) => {
  res.render("pages/login.ejs");
});

// logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/home");
  });
});

//index route

app.get(
  "/home",
  wrapAsync(async (req, res) => {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render("pages/index.ejs", { reviews });
  }),
);

// profile page

app.get(
  "/profile",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.session.userId);

    res.render("pages/profile.ejs", { user });
  }),
);

// orders get route

app.get(
  "/orders",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const orders = await Order.find({ user: req.session.userId }).sort({
      createdAt: -1,
    });
    res.render("pages/order.ejs", { orders });
  }),
);

//cart route

app.get(
  "/cart",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const cart = await Cart.find({ user: req.session.userId });
    res.render("pages/cart.ejs", { cart });
  }),
);

// Order checkout route

app.get(
  "/checkout",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const cart = await Cart.find({ user: req.session.userId });

    let total = 0;

    cart.forEach((c) => {
      c.items.forEach((i) => {
        total += i.TotalPrice;
      });
    });

    res.render("pages/checkout.ejs", { cart, total });
  }),
);

//design-studio route
app.get(
  "/design-studio",
  wrapAsync(async (req, res) => {
    // .find({ user: req.user._id })  // 🔥 filter per user
    //     .sort({ createdAt: -1 });

    const AiGenDes = await AiDesign.find({});
    const SaveAiDes = await SaveAiDesign.find({})
      .sort({ createdAt: -1 }) // newest first
      .limit(2);
    console.log(AiGenDes);
    console.log(SaveAiDes);
    res.render("pages/designStudio.ejs", { AiGenDes, SaveAiDes });
  }),
);

// pricing
app.get(
  "/pricing",
  wrapAsync(async (req, res) => {
    const prices = await Pricing.find({});
    console.log(prices);
    res.render("pages/pricing.ejs", { prices });
  }),
);

// how it woeks
app.get("/how-it-works", (req, res) => {
  res.render("pages/how-it-works.ejs");
});

// about us
app.get("/about", (req, res) => {
  res.render("pages/about.ejs");
});

// contact us
app.get(
  "/contact",
  wrapAsync(async (req, res) => {
    const con = await Contact.find({});
    res.render("pages/contact.ejs");
  }),
);

// signup post
app.post(
  "/signup",
  validate("userSchema"),
  wrapAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    req.session.user = newUser;
    req.session.userId = newUser._id;
    res.redirect("/home");
  }),
);

// login post

app.post(
  "/login",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User Not Found");
      return res.redirect("/home");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      req.flash("error", "Invalid Credentials");

      return res.redirect("/login");
    }

    req.session.userId = user._id;
    req.session.user = user;

    res.redirect("/home");
  }),
);

//taking reviews post

app.post(
  "/home/reviews",
  validate("reviewSchema", "review"),
  wrapAsync(async (req, res) => {
    const newReview = new Review(req.body.review);
    await newReview.save();
    res.redirect("/home");
  }),
);

//ai generation

app.post(
  "/design-studio/ai-generate",
  validate("aiDesignSchema", "design"),
  wrapAsync(async (req, res) => {
    const { title, BrandType, colorTheme, description } = req.body.design;

    const sloganPrompt = `Generate only short five, catchy slogans for ${title}, a brand in the ${BrandType} industry reflect this description: ${description}. Keep the slogans modern, memorable, and impactful.`;

    const imagePrompt = `Design a modern logo for ${title}, a ${BrandType} brand, using ${colorTheme} in a smooth gradient. Create a clean, minimal, and balanced layout with sharp typography that reflects ${description}, keeping the design scalable and professional with a transparent background`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: sloganPrompt,
    });

    console.log(response.text);
    let outputSlogan = response.text
      .split("\n") // split into lines
      .map((line) => line.trim()) // remove extra spaces
      .filter((line) => line.match(/^\d+\./)) // keep numbered lines only
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "") // remove "1. "
          .replace(/\*\*/g, "") // remove **
          .trim(),
      );
    // =========================
    // 🎨 IMAGE GENERATION
    // =========================

    // let imagePath = null;

    // try {
    //   const imagePrompt = `Design a modern logo for ${title}, a ${BrandType} brand, using ${colorTheme} in a smooth gradient. Create a clean, minimal, and balanced layout with sharp typography that reflects ${description}, keeping the design scalable and professional with a transparent background`;

    //   const imageResponse = await ai.models.generateContent({
    //     model: "gemini-2.5-flash",
    //     contents: imagePrompt,
    //     config: {
    //       responseModalities: ["IMAGE"],
    //     },
    //   });

    //   const base64Image = imageResponse.candidates?.[0]?.content?.parts?.find(
    //     (p) => p.inlineData,
    //   )?.inlineData?.data;

    //   // ❌ If no image generated
    //   if (!base64Image) {
    //     req.flash("error", "Image generation failed");
    //     return res.redirect("/design-studio");
    //   }

    //   // ✅ Convert to PNG
    //   const buffer = Buffer.from(base64Image, "base64");

    //   const fileName = `${req.session.userId}_${Date.now()}_genImage.png`;

    //   const uploadDir = path.join(__dirname, "public/uploads");

    //   if (!fs.existsSync(uploadDir)) {
    //     fs.mkdirSync(uploadDir, { recursive: true });
    //   }

    //   const fullPath = path.join(uploadDir, fileName);

    //   fs.writeFileSync(fullPath, buffer); // ✅ saved as PNG

    //   imagePath = "/uploads/" + fileName;
    // } catch (err) {
    //   console.log(err);
    //   req.flash("error", "Image generation failed");
    //   return res.redirect("/design-studio");
    // }

    await AiDesign.deleteMany({});
    await AiDesign.create({
      title,
      BrandType,
      colorTheme,
      description,
      outputSlogan,
      // image: imagePath, // ✅ added
    });

    console.log(sloganPrompt);
    res.redirect("/design-studio");
  }),
);

// save ai generate
app.post(
  "/design-studio/save-ai-generate",
  validate("saveAiSchema", "selected"),
  wrapAsync(async (req, res) => {
    const selected = new SaveAiDesign(req.body.selected);
    await selected.save();
    const oldDocs = await SaveAiDesign.find()
      .sort({ createdAt: -1 }) // newest first
      .skip(2); // skip latest 2

    if (oldDocs.length > 0) {
      await SaveAiDesign.deleteMany({
        _id: { $in: oldDocs.map((doc) => doc._id) },
      });
    }

    // 🔥 Keep only last 2 for THIS USER
    // const oldDocs = await SaveAiDesign
    //   .find({ user: req.user._id })   // filter per user
    //   .sort({ createdAt: -1 })
    //   .skip(2);

    // if (oldDocs.length > 0) {
    //   await SaveAiDesign.deleteMany({
    //     _id: { $in: oldDocs.map(doc => doc._id) }
    //   });
    // }

    res.redirect("/design-studio");
  }),
);

// add to cart

app.post(
  "/cart",
  isLoggedIn,
  upload.single("order[logo]"),
  validate("cartSchema", "order"),
  wrapAsync(async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const order = req.body.order;

    // project ppt time
    let logoPath = req.file ? req.file.path : null;
    // let logoPath = null;

    // if (req.file) {
    //   logoPath = "/uploads/" + req.file.filename; // ✅ FIX
    // }

    if (!logoPath) {
      req.flash("error", "Logo image is required!");
      return res.redirect("/design-studio");
    }
    // remove Rs text
    const perUnitPrice = parseInt(order.perUnitPrice.replace(" Rs", ""));
    const totalPrice = parseInt(order.TotalPrice.replace(" Rs", ""));

    const cartItem = {
      template: req.body.selectedTemplate,
      bottleVolume: order.bottleVolume,
      title: order.title,
      BrandType: order.BrandType,
      colorTheme: order.colorTheme,
      description: order.description,
      logo: logoPath,
      slogan: order.slogan,
      units: Number(order.units),
      perUnitPrice: perUnitPrice,
      TotalPrice: totalPrice,
    };

    const cart = new Cart({
      user: req.session.userId,
      items: [cartItem],
    });

    await cart.save();

    console.log("Cart saved:", cart);

    req.flash("success", "Order added Successfully in cart!");
    res.redirect("/cart");
  }),
);

// placed order

app.post(
  "/place",
  isLoggedIn,
  validate("orderSchema"),
  wrapAsync(async (req, res) => {
    const { fullName, phone, address, city, pincode } = req.body;

    const cart = await Cart.find({ user: req.session.userId });

    let items = [];
    let total = 0;

    cart.forEach((c) => {
      c.items.forEach((i) => {
        items.push(i);
        total += i.TotalPrice;
      });
    });
    // unique order number
    const orderNumber = "URB-" + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      orderNumber,
      user: req.session.userId,
      items,
      totalAmount: total,

      shippingDetails: {
        fullName,
        phone,
        address,
        city,
        pincode,
      },
    });

    await order.save();

    await Cart.deleteMany({ user: req.session.userId });

    // send email
    sendMail(req.session.user.email, order);

    req.flash("success", "Order Placed Successfully");

    res.redirect("/home");
  }),
);

// Contact form
app.post(
  "/contact",
  validate("contactSchema", "contact"),
  wrapAsync(async (req, res) => {
    const contact = new Contact(req.body.contact);
    await contact.save();
    res.redirect("/home");
  }),
);

// delete from cart
app.delete(
  "/cart/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Cart.findByIdAndDelete(id);
    console.log("item is deleted");
    res.redirect("/cart");
  }),
);

// Error handling

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;

  console.error(err);

  if (req.originalUrl === "/home") {
    return res.status(statusCode).send(message);
  }

  req.flash("error", `${statusCode} : ${message}`);
  res.redirect("/home");
});

app.listen(process.env.PORT, () => {
  console.log("server is working");
});

// module.exports = app;
