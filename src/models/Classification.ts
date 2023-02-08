export class Classification {
    id: bigint;
    name: string;
    level: number;
    parentId!: bigint;
    children!: Classification[];

    constructor(id: bigint, name: string, level: number) {
        this.id = id;
        this.name = name;
        this.level = level;
    }
}