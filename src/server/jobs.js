'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const request = require('request-promise');

const PAGE = 0;

const JobService = {
  all(req, reply) {
    return request.get(`https://www.themuse.com/api/public/companies?page=${PAGE}`)
      .then(res => {
        const result = JSON.parse(res);

        if (!result) reply('No jobs!');
        const pageCount = result.page_count;
        let promises = [];
        let companyName = [];
        let jobLocation = [];
        let industries = [];
        let i = 0;
        while (i < pageCount) {
          promises.push(request.get(`https://www.themuse.com/api/public/companies?page=${i}`));
          i++;
        }
        return Promise.all(promises)
          .then(jobs => {
            jobs.map(j => {
              const jobList = JSON.parse(j);
              jobList.results.map(job => {
                companyName.push(job.name);
                job.locations.map(location => {
                  jobLocation.push(location.name)
                });
                job.industries.map(industry => {
                  industries.push(industry.name)
                });
              });
            });
            return reply({ companyName, jobLocation: _.uniq(jobLocation), industries: _.uniq(industries) });
          });
      })
  },

  find(req, reply) {
    const { company, category, location, level, page } = req.query;
    const qs = { page: page || PAGE };

    if (company) qs.company = company;
    if (category) qs.category = category;
    if (location) qs.location = location;
    if (level) qs.level = level;

    const options = {
      uri: 'https://www.themuse.com/api/public/jobs',
      qs
    };

    return request.get(options)
      .then(jobs => {
        const jobList = JSON.parse(jobs);
        if (!jobList) {
          return reply([]);
        }

        return reply(jobList.results)
      })
  }
};

module.exports = JobService;
