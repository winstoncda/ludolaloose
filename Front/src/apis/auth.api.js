// api/user.js
import { BASE_URL } from "../utils/url";
import { handleApiResponse } from "../utils/handleApiResponse";

/**
 * Inscrit un utilisateur (étape 1).
 * @param {Object} values - { username, email, password }
 * @returns {Promise<Object>} - { success, message }
 */
export async function signup(values) {
  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau signup:", error);
    return {
      success: false,
      message: "Impossible de contacter le serveur. Veuillez réessayer.",
    };
  }
}

/**
 * Vérifie si un email a été validé.
 * @param {string} email
 * @returns {Promise<Object>} - { success, validated, userId? }
 */
export async function checkEmailValidation(email) {
  try {
    const response = await fetch(
      `${BASE_URL}/auth/check-validation?email=${encodeURIComponent(email)}`
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau checkEmailValidation:", error);
    return {
      success: false,
      message: "Erreur réseau. Veuillez réessayer.",
    };
  }
}

/**
 * Met à jour les données optionnelles de l'utilisateur.
 * @param {Object} data - { userId, gender?, age?, height?, ... }
 * @returns {Promise<Object>} - { success, message }
 */
export async function updateOptionalUserData(data) {
  try {
    const response = await fetch(`${BASE_URL}/auth/optional`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Erreur réseau updateOptionalUserData:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour. Veuillez réessayer.",
    };
  }
}
export const login = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <--- IMPORTANT to send/receive cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response);

    return {
      success: data.success,
      user: data.user,
    };
  } catch (error) {
    console.error("Erreur réseau login:", error);
    return {
      success: false,
      message: "Impossible de se connecter. Veuillez réessayer.",
    };
  }
};
