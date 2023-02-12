export class User {
    id: number;
    name: string;
    phoneNumber: string;
    type: number;
    typeName: string;
    createTime: string;


    constructor(id: number, name: string, phoneNumber: string, type: number, typeName: string, createTime: string) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.typeName = typeName;
        this.createTime = createTime;
    }
}