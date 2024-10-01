import fetch from 'node-fetch';
import * as action from '@actions/core';
import dotenv from 'dotenv';

dotenv.config();

const headers: any = {
  'Content-Type': 'application/json',
  'X-Holistics-Key': process.env.HOLISTICS_API_KEY,
}

const HOLISTICS_HOST = process.env.HOLISTICS_HOST ?? 'https://secure.holistics.io';
const HOLISTICS_API_HOST = `${HOLISTICS_HOST}/api/v2`;

async function submitDeploy () {
  const url = `${HOLISTICS_API_HOST}/aml_studio/projects/submit_deploy`;
  const result = await fetch(url, {
    method: 'post',
    headers,
  });
  const status = result.status;
  const respond = await result.json();
  console.log(JSON.stringify(respond, null, 2));
  if (status === 200) {
    return respond.job;
  }
  process.exit(1);
}

async function getJobResut (jobId: number) {
  const url = `${HOLISTICS_API_HOST}/jobs/${jobId}/result`;
  const result = await fetch(url, {
    method: 'get',
    headers,
  });
  return await result.json();
}

async function polling(jobId: number) {
  return new Promise((resolve, reject) => {
    const i = setInterval(async () => {
      console.log('Polling deployment result ...');
      const result = await getJobResut(jobId);
      console.log(`Status: ${result.status}`);
      if (result.status === 'success' || result.status === 'failure') {
        clearInterval(i);
        resolve(result);
      }
    }, 2000);
  });
}

async function run () {
  const job = await submitDeploy();
  const result = await polling(job.id) as any;
  console.log(JSON.stringify(result, null, 2));
  if (result.status === 'failure') {
    action.error(result);
    process.exit(1);
  }
  const jobResult = result.result;
  if (jobResult.status !== 'success') {
    action.error(result);
    process.exit(1);
  }
  action.setOutput('result', result);
}
run();
