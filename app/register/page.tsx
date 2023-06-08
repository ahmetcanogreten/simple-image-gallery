import RegisterForm from "./components/register_form"

export default function RegisterPage() {
    return (
        <div className="flex">
            <div className="flex  justify-items-center p-64 w-1/2">
                <img
                    src="/register/register.svg"
                    alt="Register"
                />
            </div>
            <div
                className="w-1/2 ">
                <RegisterForm />
            </div>
        </div>
    )
}