export default function getDefaultName(email: string) {
  return email.split('@')[0];
}