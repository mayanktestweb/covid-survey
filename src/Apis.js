export const default_url = "http://192.168.43.116:8080"
let api_url = default_url+"/api"

let Apis = {
    validate_admin_token: api_url+"/admin/validate_token",
    admin_login: api_url+"/admin/login",
    confirm_admin_otp: api_url+"/admin/confirm_otp",

    survey_officers: api_url+"/admin/survey_officers",
    add_survey_officer: api_url+"/admin/add_survey_officer",
    delete_survey_officer: api_url+"/admin/delete_survey_officer",

    area_blocks: api_url+"/data/areablocks",
    add_block: api_url+"/admin/add_block",
    delete_block: api_url+"/admin/delete_block",

    containment_areas: api_url+"/data/containment_areas",
    add_containment_area: api_url+"/admin/add_containment_area",
    edit_containment_area: api_url+"/admin/edit_containment_area",
    delete_containment_area: api_url+"/admin/delete_containment_area",

    quarantine_centers: api_url+"/data/quarantine_centers",
    add_quarantine_center: api_url+"/admin/add_quarantine_center",

    containment_sources: api_url+"/data/containment_sources",
    add_containment_source: api_url+"/admin/add_containment_source",
    attach_containment_sources: api_url+"/admin/attach_containment_sources",

    fetch_general_report: api_url+"/admin/fetch_general_report",
    save_edited_member: api_url+"/admin/save_edited_member",


    survey_officer_login: api_url+"/survey/login",
    confirm_survey_otp: api_url+"/survey/confirm_otp",
    validate_survey_token: api_url+'/survey/validate_token',

    containment_area_sources: api_url+"/data/containment_area_sources",
    save_family: api_url+"/survey/save_family",
    save_member: api_url+"/survey/save_member"
}

export default Apis;