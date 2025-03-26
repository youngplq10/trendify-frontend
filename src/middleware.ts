import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {

    const isAuth = req.cookies.get("isAuthenticated")?.value;
    
    //Not authenticated users trying to access only-authed content
    if (isAuth !== "true" && req.nextUrl.pathname.match("/profile")){
        return NextResponse.redirect(new URL("/sign-in", req.url));
    } 
    if (isAuth !== "true" && req.nextUrl.pathname.match("/log-out")){
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    //Authenticated users trying to access only-unauthed content
    if (isAuth === "true" && req.nextUrl.pathname.match("/sign-in")){
        return NextResponse.redirect(new URL("/", req.url));
    }
    if (isAuth === "true" && req.nextUrl.pathname.match("/sign-up")){
        return NextResponse.redirect(new URL("/", req.url));
    }
}