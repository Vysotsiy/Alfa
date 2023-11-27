export class ArrayWorker {
    public async getSummElementForArray(arr:any[]): Promise<number> {
        let summ:number = 0;
        arr.forEach(arg => {
            summ +=Number(arg)
        });
        return summ;
    }
}

