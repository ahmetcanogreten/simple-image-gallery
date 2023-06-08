import LoginForm from "./components/login_form"
import Image from "next/image"

export default function LoginPage() {
    return (
        <div className="flex">
            <div className="flex  justify-items-center p-64 w-1/2">
                <img
                    src="/login/login.svg"
                    alt="Login"
                />
            </div>
            <div
                className="w-1/2 ">
                <LoginForm />
            </div>
        </div>
    )
}