"use client";
import styles from "./page.module.scss";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";
import illustration from "@/assets/images/pablo-sign-in.svg";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [hidePassword, setHidePassword] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Should include actual login logic here
      console.log("Login data:", data);
      router.push("/users");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <header className={styles.logo}>
        <Image src={logo} alt="Lendsqr Logo" fill />
      </header>

      <main className={styles.container}>
        <aside className={styles.left}>
          <Image src={illustration} alt="Sign in illustration" />
        </aside>

        <section className={styles.right}>
          <div className={styles.title}>
            <h1>Welcome!</h1>
            <p>Enter details to login.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFields}>
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Email"
                />
                <span className={styles.formError}>
                  {errors.email?.message}
                </span>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className={styles.passwordContainer}>
                  <input
                    {...register("password")}
                    id="password"
                    type={hidePassword ? "password" : "text"}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setHidePassword(!hidePassword)}
                  >
                    {hidePassword ? "SHOW" : "HIDE"}
                  </button>
                </div>
                <span className={styles.formError}>
                  {errors.password?.message}
                </span>
              </div>

              <Link href="/password-reset" className={styles.forgotPassword}>
                FORGOT PASSWORD?
              </Link>
            </div>

            <Button
              type="submit"
              className={styles.button}
              variant="primary"
              disabled={isSubmitting}
            >
              Login
              {isSubmitting && <Loader2 className={styles.loader} />}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}
