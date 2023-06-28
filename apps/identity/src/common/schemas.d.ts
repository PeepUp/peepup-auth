declare namespace Api {
    namespace Schemas {
        namespace Application {
            namespace Root {
                type Response204 = null;
            }
        }
        namespace CheckHealth {
            namespace Create {
                interface Body {
                    email: string;
                    name: string;
                }

                interface Response201 {
                    id?: string;
                    email?: string;
                    name?: string;
                    createdAt?: string;
                    updatedAt?: string;
                }

                interface Response409 {
                    statusCode?: number;
                    error?: string;
                    message?: string;
                }

                type Request = { Body: Api.Schemas.CheckHealth.Create.Body };
            }
        }
    }
}
