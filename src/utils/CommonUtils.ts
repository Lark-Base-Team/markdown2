export class CommonUtils {
  static isDevelopment() {
    return process.env.NODE_ENV === "development";
  }
}
