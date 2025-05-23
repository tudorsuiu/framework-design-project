﻿namespace SmartService.Domain.Interfaces
{
    public interface IPasswordHasherService
    {
        string Hash(string password);
        bool Verify(string passwordHash, string inputPassword);
    }
}
