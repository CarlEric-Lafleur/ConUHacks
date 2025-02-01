import { FirebaseError } from "../enums/authentication-error.enum";

export const AUTHENTICATION_ERROR_MESSAGE = new Map<FirebaseError, string>([
    [FirebaseError.InvalidLoginCredentials, 'Identifiants de connexion invalides'],
    [FirebaseError.EmailExists, 'Email déjà utilisé'],
    [FirebaseError.InvalidPassword, 'Mot de passe invalide'],
    [FirebaseError.UserNotFound, 'Utilisateur introuvable'],
    [FirebaseError.InvalidEmail, 'Email invalide'],
]);