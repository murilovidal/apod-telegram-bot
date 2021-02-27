export const enum BotMessage {
  Welcome = "Welcome! This bot retrieves the NASA's Picture of the Day on command. Use /image to receive the picture of the day from NASA or /random to receive a random picture",
  AlreadySubscribed = "You are already subscribed! To unsubscribe use /unsubscribe.",
  SubscriptionSuccessful = "Subscription successful! You will receive the NASA's Astronomy Picture Of the Day automatically.",
  SubscriptionFailed = "Unable to complete subscription. Please try again later.",
  UnsubscriptionSuccessful = "Unsubscription successful! You will NOT receive the NASA's Astronomy Picture Of the Day automatically.",
  SubscriptionUnsuccessful = "Unable to complete unsubscription. Please try again later.",
  Help = "Use /image to receive the picture of the day or /random to receive a random picture.",
  FailedToSendApod = "Failed to recover the image of the day. :(",
  UnsubscriptionFailed = "Unable to complete unsubscription. Please try again later.",
}
