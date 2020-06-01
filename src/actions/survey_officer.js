export const SET_SURVEY_OFFICER = "surveyOfficer:setSurveyOfficer"

export function setSurveyOfficer(officer) {
    return {
        type: SET_SURVEY_OFFICER,
        payload: officer
    }
}