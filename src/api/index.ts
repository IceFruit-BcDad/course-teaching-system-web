export class Api {
    public static GetClassifications = "/api/classification";

    public static CreateClassification = "/api/classification";

    public static UpdateClassification(id: bigint): string{
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

}
