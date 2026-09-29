namespace SecureBank.Api.Exceptions;

public class SigninValidationException : Exception
{
    public string Code { get; }

    public SigninValidationException(string message, string code = "VALIDATION_ERROR")
        : base(message)
    {
        Code = code;
    }
}

public class SigninAuthenticationException : Exception
{
    public string Code { get; }

    public SigninAuthenticationException(string message, string code = "INVALID_CREDENTIALS")
        : base(message)
    {
        Code = code;
    }
}
