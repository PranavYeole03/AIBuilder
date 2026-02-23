import User from "../models/user.model.js";
import stripe from "../config/stripe.js"

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"]
  let event;
  console.log("🔥 WEBHOOK HIT");
  console.log("METADATA:", event.data.object.metadata);
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "webhook error" })
  }

  if (event.type == "checkout.session.completed") {
    const session = event.data.object
    const userId = session.metadata.userId
    const credit = Number(session.metadata.credit)
    const plan = session.metadata.plan

    await User.findByIdAndUpdate(userId, {
      $inc: { credit },
      plan
    })
    console.log("UPDATED CREDIT:", updated.credit);
  }
  return res.json({ received: true })
}
