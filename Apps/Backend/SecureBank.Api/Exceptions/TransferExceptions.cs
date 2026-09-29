namespace SecureBank.Api.Exceptions;

public class TransferValidationException : Exception
{
    public string Code { get; }

    public TransferValidationException(string message, string code = "VALIDATION_ERROR")
        : base(message)
    {
        Code = code;
    }
}

public class TransferAuthorizationException : Exception
{
    public string Code { get; }

    public TransferAuthorizationException(string message, string code = "UNAUTHORIZED")
        : base(message)
    {
        Code = code;
    }
}
