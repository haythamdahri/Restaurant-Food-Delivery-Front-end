export class Payment {
    public amount: number;
    public stripePublicKey: string;
    public noActiveOrder: boolean;
    public currency: string;
    public status: boolean
}