namespace SecureBank.Api.Exceptions;

public class SignupValidationException : Exception
{
    public string Code { get; }

    public SignupValidationException(string message, string code = "VALIDATION_ERROR")
        : base(message)
    {
        Code = code;
    }
}

public class SignupConflictException : Exception
{
    public string Code { get; }

    public SignupConflictException(string message, string code = "EMAIL_ALREADY_EXISTS")
        : base(message)
    {
        Code = code;
    }
}
