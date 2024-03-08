﻿using DataAccessLayer.dbContext;
using DataAccessLayer.Models.Entities;
using DataAccessLayer.Models;
using DataAccessLayer.Interfaces;

namespace DataAccessLayer.Repositories
{
    //This class is responsible for creating an answer entity
    public class AnswerRepo(AiLearnerDbContext context) : RepositoryBase<Answer>(context), IAnswerRepo
    {
        public async Task<List<Answer>> CreateAnswer(List<Question> idList, List<Questions> textList)
        {
            List<Answer> answerEntities = new List<Answer>();
            //Interate through the questions
            foreach (var question in idList)
            {
                //Interate through the text list
                foreach (var text in textList)
                {
                    //If the question text matches the text in the list
                    if (question.Text == text.Question)
                    {
                        //Interate through the question's options and create the answer's entities
                        foreach (var answer in text.Options!)
                        {
                            answerEntities.Add(new Answer
                            {
                                QuestionId = question.QuestionId,
                                Text = answer.Value,
                                IsCorrect = answer.Key == text.Answer
                            });
                        }

                    }
                }
            }
            await _context.AddRangeAsync(answerEntities);
            await _context.SaveChangesAsync();
            return answerEntities;
        }
    }
}