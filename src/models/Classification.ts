export class Classification {
    id: number;
    name: string;
    level: number;
    parentId!: number;
    children!: Classification[];

    constructor(id: number, name: string, level: number) {
        this.id = id;
        this.name = name;
        this.level = level;
    }
}