export const analyticsEvents = {
  backToHomeClicked: "back_to_home_clicked",
  backToTopClicked: "back_to_top_clicked",

  calendlyOpened: "calendly_opened",
  certificateOpened: "certificate_opened",
  chatbotError: "chatbot_error",
  chatbotConversationStarted: "chatbot_conversation_started",
  chatbotMessageSent: "chatbot_message_sent",
  chatbotOpened: "chatbot_opened",
  chatbotReset: "chatbot_reset",
  chatbotSuggestedQuestionClicked: "chatbot_suggested_question_clicked",
  commandPaletteCommandSelected: "command_palette_command_selected",
  commandPaletteOpened: "command_palette_opened",
  contactFormFailed: "contact_form_failed",
  contactFormStarted: "contact_form_started",
  contactFormSubmitted: "contact_form_submitted",
  emailClicked: "email_clicked",
  mentorshipLinkOpened: "mentorship_link_opened",
  outboundLinkClicked: "outbound_link_clicked",
  projectDetailOpened: "project_detail_opened",
  projectLiveOpened: "project_live_opened",
  resumeOpened: "resume_opened",
  socialClicked: "social_clicked",
  themeChanged: "theme_changed",
  videoPlayed: "video_played",
  videoProgress: "video_progress",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];
