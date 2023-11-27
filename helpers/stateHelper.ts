export class StateHelper {
    public state: unknown = {};

    public setValue<T>(key: string, value: T): void {
        this.state[key] = value;
    }
    public getValue<T>(key: string): T {
        return this.state[key];
    }

    public getAllState(): unknown {
        return this.state;
    }
}