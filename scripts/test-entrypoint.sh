#!/bin/sh

set -ex

npx prisma migrate dev
npm run test
