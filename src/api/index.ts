export class Api {
    public static GetClassifications = "/api/classification";

    public static GetClassification(id: number): string{
        return "/api/classification/" + id.toString();
    }

    public static CreateClassification = "/api/classification";

    public static UpdateClassification(id: number): string{
        return "/api/classification/" + id.toString();
    }

    public static DeleteClassifications(ids: string): string{
        return "/api/classification/" + ids;
    }

    public static Login = "/api/login";
    public static Logout = "/api/logout";

    public static GetUserInfo(userId: any): string{
        return "/api/user/" + userId;
    }

    public static GetCourses(offset: number, limit: number, classificationId: any = undefined): string{
        let url = "/api/course?" + "offset=" + offset + "&limit=" + limit;
        if(classificationId){
            url += "&classificationId=" + classificationId;
        }
        return url;
    }

    public static CreateCourse = "/api/course";

    public static UpdateCourse(id: number): string{
        return "/api/course/" + id.toString();
    }

    public static DeleteCourse(id: number): string {
        return "/api/course/" + id.toString();
    }

    public static GetChapters(courseId: number): string{
        return "/api/chapter?" + "courseId=" + courseId ;
    }

    public static GetChapter(id: number): string{
        return "/api/chapter/" + id.toString();
    }

    public static CreateOrUpdateChapter = "/api/chapter";

    public static DeleteChapter(id: number): string {
        return "/api/chapter/" + id.toString();
    }

    public static UploadImg = "/api/file/uploadImg";
    public static Upload = "/api/file/upload";

    public static GetUsers(offset: number, limit: number): string{
        return "/api/user?" + "offset=" + offset + "&limit=" + limit;
    }

    public static CreateUser = "/api/user";

    public static UpdateUser(id: number): string{
        return "/api/user/" + id.toString();
    }

    public static DeleteUser(id: number): string {
        return "/api/user/" + id.toString();
    }

}
