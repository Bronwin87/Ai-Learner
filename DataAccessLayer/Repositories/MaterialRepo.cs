﻿using DataAccessLayer.dbContext;
using DataAccessLayer.Interfaces;
using DataAccessLayer.Models.Entities;
using System.Runtime.InteropServices;


namespace DataAccessLayer.Repositories
{
    public class MaterialRepo(AiLearnerDbContext context) : RepositoryBase<Material>(context), IMaterialRepo
    {
        public async Task<Material> CreateMaterial(string userId, string topic, string content, string summery)
        {
            Material material = new()
            {
                UserId = userId,
                Topic = topic,
                Content = content,
                summery = summery,
                UploadDate = DateTime.Now
            };

            _context.Add(material);
            await Console.Out.WriteLineAsync((char)material.MaterialId);
            await this.CreateAsync(material);

            return material;
        }
    }
}