# Form Fueled
A web application to create and share questionnaire and get responses from any user.

This application was created based on the following `Zen of Python` principle
>Simple is better than complex.

There are 2 seperate applications (check out respective folder's README for more details):
- [Django backend API](backend)
- [Angular frontend](frontend)

# Assumptions / Shortcomings
- Questionnaire CRUD operation requires authentication
- All questions are mandatory in a questionnaire
- Sequence of the questions that appear in the questionnaire are non-configurable (added implicitly)
- Two types of questions have been implemented
  - `TEXT`: A question which requires a text based answer
  - `MCSS`: A multi-choice single select wherein users can select only one of the available options
- Restrictions (just for simplicity)
  - 100 questions per questionnaire
  - 5 options for `MCSS` question type


# License
 This program is free software under MIT license. Please see the [LICENSE](LICENSE) file in our repository for the full text.