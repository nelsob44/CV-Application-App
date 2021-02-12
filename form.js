//This is the form.
//The code uses these names to build an object that matches what needs to be submitted

export default {
    formName: "CV Builder",
    items: [
        {
            validate: true,
            stage: 1,
            stagename: "Personal Details",
            questions: [
                {
                    formName: "first_name",
                    Label: "First Name",
                    type: "text-field",
                    validation: [(v) => !!v || "First name is required"],
                },
                {
                    formName: "last_name",
                    Label: "Last Name",
                    type: "text-field"
                },
                {
                    formName: "email",
                    Label: "Email",
                    type: "text-field",
                    validation: [
                        (v) => !!v || "E-mail is required",
                        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
                    ],
                },
                {
                    formName: "phone_number",
                    Label: "Phone number",
                    type: "text-field"
                }
            ],
        },
        {
            stage: 2,
            validate: true,
            stagename: "Application Information",
            questions: [
                {
                    formName: "live_in_uk",
                    Label: "Do you live in the UK?",
                    type: "radio",
                    options: [
                        {
                            name: "Yes",
                            value: true,
                        },
                        {
                            name: "No",
                            value: false,
                        },
                    ],
                    validation: [(v) => !!v || "This field is required"],
                },
                {
                    formName: "git_profile",
                    Label: "Your Github Profile",
                    type: "text-field",
                    validation: [(v) => !!v || "This field is required"],
                },
                {
                    formName: "about_you",
                    Label: "About You",
                    type: "text-area",
                    validation: [(v) => !!v || "This field is required"],
                },
            ],
        },
        {
            stage: 3,
            validate: true,
            stagename: "Files upload",
            questions: [
                {
                    formName: "cv",
                    Label: "Upload CV",
                    type: "file-input",
                    validation: [(v) => !!v || "This field is required"],
                },
                {
                    formName: "cover_letter",
                    Label: "Upload Cover Letter",
                    type: "file-input",
                    validation: [(v) => !!v || "This field is required"],
                },
            ],
        }
    ]
};
