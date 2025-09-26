import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthServices } from "@auth/services/auth-services";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {

  const token = inject(AuthServices).token();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
