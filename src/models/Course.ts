import {Chapter} from "@/models/Chapter";

export class Course {
  id: number;
  name: string;
  classificationId: number;
  classificationName: string;
  createTime: string;
  lastModifyTime: string;
  coverUrl: string;
  chapters: Chapter[]


  constructor(id: number, name: string, classificationId: number, classificationName: string, createTime: string, lastModifyTime: string, coverUrl: string, chapters: Chapter[]) {
    this.id = id;
    this.name = name;
    this.classificationId = classificationId;
    this.classificationName = classificationName;
    this.createTime = createTime;
    this.lastModifyTime = lastModifyTime;
    this.coverUrl = coverUrl;
    this.chapters = chapters;
  }
}

export class CreateOrUpdateCourseRequest {
  classificationId: number;
  name: string;
  coverUrl: string;

  constructor(classificationId: number, name: string, coverUrl: string) {
    this.classificationId = classificationId;
    this.name = name;
    this.coverUrl = coverUrl;
  }
}
