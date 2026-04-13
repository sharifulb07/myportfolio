declare module "mongo-sanitize" {
  export default function mongoSanitize<T>(input: T): T;
}
