# Kabyle Voice Word Garden

Build a modern AI-powered research platform called "KabyleVoice".

Goal:

KabyleVoice is an academic platform designed to collect, organize, validate and manage Kabyle (Taqbaylit) speech datasets for Artificial Intelligence research.

The platform is NOT a translation app.

Its main objective is to create the highest-quality Kabyle speech corpus that can later be used to train Speech Recognition (ASR), Speech Translation, Text-to-Speech (TTS), and Large Language Models.

Design Style:

- Premium

- Modern

- Minimalist

- Inspired by OpenAI, Hugging Face, and Notion

- White background

- Green primary (#16A34A)

- Orange accent (#F97316)

- Rounded cards

- Beautiful charts

- Responsive

- Dark mode support

- Smooth animations

- Professional typography

Pages:

1. Landing Page

- Hero section

- Project presentation

- Why Kabyle AI matters

- Statistics

- Call to Action

- Contributors

- Research objectives

- FAQ

2. Authentication

- Login

- Register

- Forgot password

- Email verification

3. Dashboard

Display:

Total recordings

Total hours

Validated recordings

Pending recordings

Rejected recordings

Number of contributors

Average audio quality

Daily statistics

Recent uploads

Charts

Leaderboard

4. Audio Upload

Allow users to

Upload audio

Record directly from browser

Choose language (Kabyle)

Choose dialect

Choose region

Choose gender

Choose age group

Choose recording type

Reading

Conversation

Story

Interview

Podcast

Emotion

Happy

Sad

Neutral

Angry

Background noise

Silent

Street

Home

Car

Office

Audio preview before upload

Upload progress

5. Sentence Reading

Display one sentence.

User records it.

Save recording.

Automatically load next sentence.

Progress bar.

Gamification.

Points.

Badges.

6. Audio Validation

Administrators can

Listen

Approve

Reject

Write comments

Correct transcription

Assign quality score

7. Automatic Transcription

Integrate Whisper API.

After upload:

Generate automatic transcription.

Display editable transcription.

Highlight confidence score.

Allow human correction.

Store both original and corrected transcription.

8. Dataset Explorer

Search recordings.

Filters:

Gender

Age

Region

Dialect

Recording type

Duration

Quality

Validation status

Contributor

Export selected data.

9. Contributor Profile

Profile picture

Statistics

Hours contributed

Badges

Achievements

Contribution history

Ranking

10. Admin Panel

Manage users

Manage recordings

Manage sentences

Manage validation

Manage contributors

System statistics

Dataset exports

11. Research Dashboard

Display:

Word frequency

Speaker distribution

Gender distribution

Region distribution

Age distribution

Recording duration histogram

Daily growth

Dataset quality

12. Dataset Export

Export

CSV

JSON

Metadata

Audio package

Research manifest

13. Settings

Language

Dark mode

Notification preferences

Profile

Security

API keys

Database Design

Entities:

Users

Speakers

Sentences

AudioFiles

Regions

Dialects

Transcriptions

Validations

Projects

Statistics

Badges

Achievements

Roles

Logs

Each audio must contain:

Unique ID

Speaker ID

Sentence ID

Duration

Recording date

Language

Dialect

Region

Gender

Age

Noise level

Emotion

Quality score

Automatic transcription

Corrected transcription

Validation status

Storage path

File size

Sample rate

Audio format

Admin comments

AI Features

Prepare architecture for:

Whisper Speech-to-Text

Future Kabyle LLM

Future Translation

Future Text-to-Speech

Future Voice Assistant

Future Fine-Tuning

No fake data.

Generate production-ready code.

Generate PostgreSQL schema.

Generate REST API.

Generate responsive frontend.

Generate clean architecture.

Follow SOLID principles.

Follow Clean Architecture.

Generate documentation.

The project should look like a professional research platform funded by an international AI laboratory rather than a student project.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b358d56c-f472-4e40-874f-056fcaad6249).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
