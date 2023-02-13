export class Chapter {
    id: number;
    courseId: number;
    parentId: number;
    title: string;
    contentUrl: string;
    createTime: string;
    lastModifyTime: string;
    children: Chapter[];


    constructor(id: number, courseId: number, parentId: number, title: string, contentUrl: string, createTime: string, lastModifyTime: string, children: Chapter[]) {
        this.id = id;
        this.courseId = courseId;
        this.parentId = parentId;
        this.title = title;
        this.contentUrl = contentUrl;
        this.createTime = createTime;
        this.lastModifyTime = lastModifyTime;
        this.children = children;
    }
}

export class CreateOrUpdateChapterRequest {
    chapterId?: number;
    courseId: number;
    parentId?: number;
    title: string;
    contentUrl?: string;


    constructor(courseId: number, title: string) {
        this.courseId = courseId;
        this.title = title;
    }
}