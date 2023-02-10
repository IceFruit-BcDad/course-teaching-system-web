export class Api {
    public static GetClassifications = "/api/classification";

    public static CreateClassification = "/api/classification";

    public static UpdateClassification(id: bigint): string{
        return "/api/classification/" + id.toString();
    }

    public static Login = "/api/login";
    public static Logout = "/api/logout";

    public static GetUserInfo(userId: any){
        return "/api/user/" + userId;
    }

}
