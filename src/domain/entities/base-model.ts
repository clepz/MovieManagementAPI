export default abstract class BaseModel {
    abstract id: string | number;
    payload?: {
        userId: string;
    };
}
