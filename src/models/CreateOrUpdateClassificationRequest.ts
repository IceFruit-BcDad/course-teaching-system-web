export class CreateOrUpdateClassificationRequest {
    level: number;
    parentId?: bigint;
    name: string;


    constructor(level: number, name: string) {
        this.level = level;
        this.name = name;
    }
}