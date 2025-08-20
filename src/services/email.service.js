import emailjs from "@emailjs/browser";

emailjs.init("Ugw_neuMeQwzazkDv");

const SERVICE_ID = "service_juusocr";
const TEMPLATE_ID = "template_tfexpim";
const PUBLIC_KEY = "Ugw_neuMeQwzazkDv";

export const sendPasswordResetEmail = async (
  userEmail,
  resetUrl,
  userName = ""
) => {
  try {
    const templateParams = {
      to_email: userEmail,
      to_name: userName || userEmail.split("@")[0],
      reset_url: resetUrl,
      company_name: "Amazon Clone",
      from_name: "Amazon Clone Support",
      reply_to: "noreply@amazon-clone.com",
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return {
      success: true,
      message: "Reset email sent successfully",
      response,
    };
  } catch (error) {
    console.error("EmailJS Error:", error);
    throw new Error("Failed to send reset email");
  }
};
