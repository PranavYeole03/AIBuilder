// import User from "../models/user.model.js";
// import stripe from "../config/stripe.js"

// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"]
//   let event;
//   console.log("🔥 WEBHOOK HIT");
//   console.log("METADATA:", event.data.object.metadata);
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     )
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ message: "webhook error" })
//   }

//   if (event.type == "checkout.session.completed") {
//     const session = event.data.object
//     const userId = session.metadata.userId
//     const credit = Number(session.metadata.credit)
//     const plan = session.metadata.plan

//     await User.findByIdAndUpdate(userId, {
//       $inc: { credit },
//       plan
//     })
//     console.log("UPDATED CREDIT:", updated.credit);
//   }
//   return res.json({ received: true })
// }


import User from "../models/user.model.js"
import stripe from "../config/stripe.js"

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.log("❌ Stripe signature error:", err.message)
    return res.status(400).send("Webhook Error")
  }

  console.log("✅ Webhook received:", event.type)

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object

      console.log("Metadata:", session.metadata)

      const userId = session.metadata?.userId
      const credit = Number(session.metadata?.credit || 0)
      const plan = session.metadata?.plan

      if (!userId) {
        console.log("❌ Missing userId in metadata")
        return res.json({ received: true })
      }

      const updated = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { credit },
          plan
        },
        { new: true }
      )

      console.log("✅ Updated credit:", updated.credit)
    } catch (dbErr) {
      console.log("❌ DB update error:", dbErr)
    }
  }

  res.json({ received: true })
}
