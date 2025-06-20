export const swaggerDoc = {
  openapi: '3.0.1',
  info: {
    title: 'Morenaas - MOvie RENtal As A Service',
    description: 'This is a fictional sample of a movie rental API.',
    contact: {
      email: 'marcelorispoli@gmail.com',
    },
    version: '1.0.0',
  },
  servers: [
    {
      url: process.env.APP_HOST || 'http://localhost:3001',
    },
  ],
  tags: [
    {
      name: 'auth',
      description:
        'The user creates his registration, performs his authentication, ' +
        'informs that forgot his password and resets it.',
    },
    {
      name: 'user',
      description: 'Retrieves, updates and deletes users data.',
    },
    {
      name: 'movie',
      description: 'Registers, rents and lists movies.',
    },
  ],
  paths: {
    //#region auth tag
    '/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'User creation',
        description: 'User self registration',
        requestBody: {
          description: 'Request body for the user to create his registration.',
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/requestBodies/auth_register' },
              encoding: { file: { contentType: 'application/pdf' } },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/auth_register' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  invalid_pdf: { $ref: '#/components/responses/invalid_pdf' },
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_fields: {
                    value: {
                      error:
                        "The fields 'name', 'cpf', 'email', 'password' " +
                        'are required in this request, but the fields ' +
                        "'name', 'email' have been omitted.",
                    },
                  },
                  invalid_cpf: {
                    $ref: '#/components/responses/invalid_cpf',
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                  cpf_already_exists: {
                    value: {
                      error:
                        "User with CPF '123.456.789-09' already registered.",
                    },
                  },
                  email_already_exists: {
                    $ref: '#/components/responses/email_already_exists',
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'User login',
        description: 'The user gets the API usage token.',
        requestBody: {
          description: 'Request body for the user access to the API.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/auth_login' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/auth_login' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_fields: {
                    value: {
                      error:
                        "The fields 'email', 'password' are required in this " +
                        "request, but the field 'password' has been omitted.",
                    },
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                  invalid_user_pass: {
                    value: {
                      error: 'Incorret password informed.',
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/email_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'User logout',
        description: 'The user clears the API usage token.',
        requestBody: {
          description: 'Request body for the user exit of the API.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/required_email' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/success' },
                example: { success: 'Logged out user.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_email: {
                    $ref: '#/components/responses/required_email',
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/email_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
      },
    },
    '/auth/forgot_password': {
      post: {
        tags: ['auth'],
        summary: 'User forgot password',
        description:
          'User informs that he forgot the password to receive ' +
          'email containing the password reset token.',
        requestBody: {
          description:
            'Request body for the user to inform that he forgot his password.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/required_email' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/success' },
                example: { success: 'Forgot password email sended.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_email: {
                    $ref: '#/components/responses/required_email',
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                  send_mail_failed: {
                    value: {
                      error:
                        "Error on send email with subject 'Morenaas - " +
                        "Forgot your password?' to address 'example@email.com'",
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/email_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
      },
    },
    '/auth/reset_password': {
      post: {
        tags: ['auth'],
        summary: 'User reset password',
        description:
          'User informs his email, the password reset token ' +
          'received by email and the new access password.',
        requestBody: {
          description:
            'Request body for the user to reset his password in the API.',
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/auth_reset_pass' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/success' },
                example: { success: 'Password redefined.' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_fields: {
                    value: {
                      error:
                        "The fields 'email', 'password', 'token' are required " +
                        "in this request, but the field 'token' has been omitted.",
                    },
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                  invalid_reset_token: {
                    value: {
                      error: 'Incorrect token for password reset informed.',
                    },
                  },
                  expired_reset_token: {
                    value: {
                      error:
                        'Token for password reset expired. Request a new one.',
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/email_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
      },
    },
    //#endregion

    //#region user tag
    '/user/details': {
      get: {
        tags: ['user'],
        summary: 'Logged user gets his own data.',
        description: 'Authenticated user gets his registration details.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_details',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/details/{cpf}': {
      get: {
        tags: ['user'],
        summary: "Worker gets a user's details",
        description: "Worker informs a user's CPF to get your data.",
        parameters: [{ $ref: '#/components/parameters/cpf' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_details',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_params: {
                    $ref: '#/components/responses/required_params',
                  },
                  required_cpf: { $ref: '#/components/responses/required_cpf' },
                  invalid_cpf: { $ref: '#/components/responses/invalid_cpf' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: { $ref: '#/components/responses/cpf_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/list': {
      get: {
        tags: ['user'],
        summary: 'Workers gets a list of all users with a name filter.',
        description:
          'Workers gets a list of users with an optional name snippet filter.',
        parameters: [{ $ref: '#/components/parameters/name_snippet' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_list',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error:
                    "Users with case-insensitive name containing 'XYZ' not found.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/list/{user_category}': {
      get: {
        tags: ['user'],
        summary: 'Workers gets a list of users by category with a name filter.',
        description:
          'Workers gets a list of users with an optional name snippet filter.',
        parameters: [
          { $ref: '#/components/parameters/user_category' },
          { $ref: '#/components/parameters/name_snippet' },
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_list',
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  physical_persons_not_found: {
                    value: {
                      error:
                        "Physical person users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                  workers_not_found: {
                    value: {
                      error:
                        "Worker users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                  unchecked_users_not_found: {
                    value: {
                      error:
                        "Unchecked users with case-insensitive name containing 'XYZ' not found.",
                    },
                  },
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/email': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated user updates his email.',
        description: 'Authenticated user updates his own email.',
        requestBody: {
          description: 'Request body for the user updates his own email.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/user_email' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_patch',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_email: {
                    $ref: '#/components/responses/required_email',
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                  email_already_exists: {
                    $ref: '#/components/responses/email_already_exists',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/mobile': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated user updates his cell phone.',
        description: 'Authenticated user updates his own mobile phone number.',
        requestBody: {
          description: 'Request body for the user updates his own cell phone.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/user_mobile' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_mobile',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_field: {
                    value: {
                      error:
                        "The field 'mobile' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalid_phone: {
                    value: {
                      error:
                        "The number '1199998888' is not a valid Brazilian " +
                        'mobile phone according to Google rules.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/landline': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated user updates his landline.',
        description: 'Authenticated user updates his own fixed phone number.',
        requestBody: {
          description: 'Request body for the user updates his own landline.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/user_landline' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_landline',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_field: {
                    value: {
                      error:
                        "The field 'landline' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalid_phone: {
                    value: {
                      error:
                        "The number '11333334444' is not a valid Brazilian " +
                        'landline phone according to Google rules.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/name': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated non-customer user updates his name.',
        description: 'Authenticated non-customer user updates his own name.',
        requestBody: {
          description: 'Request body for the user updates his own name.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/user_name' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_patch',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_field: {
                    value: {
                      error:
                        "The field 'name' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/user_access_only' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/file': {
      patch: {
        tags: ['user'],
        summary: 'Authenticated non-customer user updates his own PDF file.',
        description:
          'Authenticated non-customer user updates his PDF documentation file.',
        requestBody: {
          description: 'Request body for the user updates his own PDF file.',
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/requestBodies/user_file' },
              encoding: { file: { contentType: 'application/pdf' } },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_file',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  invalid_pdf: { $ref: '#/components/responses/invalid_pdf' },
                  required_pdf: {
                    value: {
                      error:
                        'This request must have a PDF file uploaded. ' +
                        'Client access is granted after sending and ' +
                        'approving the documentation.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/user_access_only' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/worker': {
      patch: {
        tags: ['user'],
        summary: 'Worker grants worker access privileges to a user.',
        description:
          'Worker user grants worker access privileges to another user.',
        requestBody: {
          description: 'Request body for grants worker privileges to a user.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/required_cpf' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_worker',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_cpf: { $ref: '#/components/responses/required_cpf' },
                  invalid_cpf: { $ref: '#/components/responses/invalid_cpf' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: { $ref: '#/components/responses/cpf_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/worker/revoke': {
      patch: {
        tags: ['user'],
        summary: 'Worker revokes worker access privileges to a user.',
        description:
          'Worker user revokes worker access privileges to another user.',
        requestBody: {
          description: 'Request body for revokes worker privileges to a user.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/required_cpf' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_worker_revoke',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_cpf: { $ref: '#/components/responses/required_cpf' },
                  invalid_cpf: { $ref: '#/components/responses/invalid_cpf' },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: { $ref: '#/components/responses/cpf_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/customer': {
      patch: {
        tags: ['user'],
        summary: 'Worker grants customer access privileges to a user.',
        description:
          'Worker user grants customer access privileges to another user.',
        requestBody: {
          description: 'Request body for grants customer privileges to a user.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/required_cpf' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_customer',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_cpf: { $ref: '#/components/responses/required_cpf' },
                  invalid_cpf: { $ref: '#/components/responses/invalid_cpf' },
                  required_pdf: {
                    value: {
                      error:
                        "The user didn't upload a file. Client access is  " +
                        'granted after sending and approving the documentation',
                    },
                  },
                  send_mail_failed: {
                    value: {
                      error:
                        "Error on send email with subject 'Morenaas - Your " +
                        "registration has been approved!' to address " +
                        "'example@email.com'",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: { $ref: '#/components/responses/cpf_not_found' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/user/register': {
      put: {
        tags: ['user'],
        summary: 'Authenticated user updates his own data.',
        description: 'Authenticated user updates his own email and phones.',
        requestBody: {
          description: 'Request body for the user updates his own data.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/user_register' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/user_register',
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_fields: {
                    value: {
                      error:
                        "The fields 'email', 'mobile', 'landline' " +
                        'are required in this request, but the field ' +
                        "'email' has been omitted.",
                    },
                  },
                  invalid_email: {
                    $ref: '#/components/responses/invalid_email',
                  },
                  email_already_exists: {
                    $ref: '#/components/responses/email_already_exists',
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
      delete: {
        tags: ['user'],
        summary: 'Authenticated user deletes his registration.',
        description: 'Authenticated user deletes his own registration.',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/success',
                },
                example: {
                  success: "User '123.456.789-09' deleted.",
                },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/responses/response_error',
                },
                examples: {
                  required_return: {
                    value: {
                      error:
                        'According to our system, there is 1 rented with you. ' +
                        'You can delete your registration after the return.',
                    },
                  },
                  send_user_deleted_mail_failed: {
                    value: {
                      error:
                        "Error on send email with subject 'Morenaas - " +
                        "Your data and user has been deleted' to address " +
                        "'example@email.com'",
                    },
                  },
                  send_customer_deleted_mail_failed: {
                    value: {
                      error:
                        "Error on send email with subject 'Morenaas - Your " +
                        "user has been deleted' to address 'example@email.com'.",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    //#endregion

    //#region movie tag
    '/movie/register': {
      post: {
        tags: ['movie'],
        summary: 'Movie registration',
        description: 'Worker creates a new movie for rental.',
        requestBody: {
          description: 'Request body for the worker registers a movie.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/movie_register' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_register' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_fields: {
                    value: {
                      error:
                        "The fields 'title', 'director' are required in this " +
                        "request, but the field 'title' has been omitted.",
                    },
                  },
                  movie_already_exists: {
                    value: {
                      error:
                        "Movie with title 'Jurassic Park' and director " +
                        "'Stenven Spielberg' already registered.",
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/movie/tape': {
      post: {
        tags: ['movie'],
        summary: 'Movie tape registration',
        description: 'Worker creates a new movie tape for rental.',
        requestBody: {
          description: 'Request body for the worker registers a movie tape.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/requestBodies/movie_tape_register',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_tape_register' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_field: {
                    value: {
                      error:
                        "The field 'movie_id' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error: "Movie with id '1' not found. See the list of movies.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/movie/rent': {
      post: {
        tags: ['movie'],
        summary: 'Movies rental',
        description: 'The customer rents movies.',
        requestBody: {
          description: 'Request body for the customer to make a movie rental.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/movie_rent' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_rent' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_field: {
                    value: {
                      error:
                        "The field 'movies_id' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalid_movies: {
                    value: {
                      error:
                        'Movies requested for rental are invalid. ' +
                        'See the list of available movies.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/customer_access_only' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error:
                    'Movies requested for rental not found. ' +
                    'See the list of available movies',
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/movie/return': {
      post: {
        tags: ['movie'],
        summary: 'Return of rented movies',
        description: 'The customer returns rented movies.',
        requestBody: {
          description:
            'Request body for the customer to return a movie rental.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/requestBodies/movie_return' },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_return' },
              },
            },
          },
          400: {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                examples: {
                  required_body: {
                    $ref: '#/components/responses/required_body',
                  },
                  required_field: {
                    value: {
                      error:
                        "The field 'rent_id' is required in this request, " +
                        'but has been omitted.',
                    },
                  },
                  invalid_rent: {
                    value: {
                      error:
                        "The movie rental with id '$ {id}' is invalid. " +
                        'Your user has not made this rental.',
                    },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/customer_access_only' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error: "No movies found to return on rent with id '1'.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/movie/list': {
      get: {
        tags: ['movie'],
        summary: 'Users gets a list of movies with title filter.',
        description:
          'Users gets a list of movies with an optional title snippet filter.',
        parameters: [{ $ref: '#/components/parameters/title_snippet' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_list' },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error:
                    'Movies with case-insensitive ' +
                    "title containing 'XYZ' not found.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/movie/list/available': {
      get: {
        tags: ['movie'],
        summary: 'Users gets a list of available movies with title filter.',
        description:
          'Users gets a list of available movies ' +
          'with an optional title snippet filter.',
        parameters: [{ $ref: '#/components/parameters/title_snippet' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_list_status' },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error:
                    'Available movies with case-insensitive ' +
                    "title containing 'XYZ' not found.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    '/movie/list/rented': {
      get: {
        tags: ['movie'],
        summary: 'Workers gets a list of rented movies with title filter.',
        description:
          'Users gets a list of unavailable movies ' +
          'with an optional title snippet filter.',
        parameters: [{ $ref: '#/components/parameters/title_snippet' }],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/movie_list_status' },
              },
            },
          },
          401: { $ref: '#/components/responses/authentication_error' },
          403: { $ref: '#/components/responses/worker_access_only' },
          404: {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/responses/response_error' },
                example: {
                  error:
                    'Rented movies with case-insensitive ' +
                    "title containing 'XYZ' not found.",
                },
              },
            },
          },
          500: { $ref: '#/components/responses/unexpected_error' },
        },
        security: [{ token: '' }],
      },
    },
    //#endregion
  },
  components: {
    requestBodies: {
      //#region request bodies fields
      cpf: {
        name: 'cpf',
        type: 'string',
        description:
          'CPF is the Brazilian code for individuals (physical persons). ' +
          'This code is unique for each person and is validated in our API. ' +
          'You can only inform numbers that ' +
          'the CPF will be saved and returned formatted.',
        example: '123.456.789-09',
      },
      name: {
        name: 'name',
        type: 'string',
        description: "User's full name.",
        example: 'João Silva',
      },
      email: {
        name: 'email',
        type: 'string',
        format: 'email',
        description: "User's email. This data is validated.",
        example: 'jsilva@mail.com',
      },
      mobile: {
        name: 'mobile',
        type: 'string',
        description:
          "User's cell phone number in Brazil. The phone is not required, " +
          'but if informed, it is validated according to Google rules.',
        example: '(11) 99999-8888',
      },
      landline: {
        name: 'landline',
        type: 'string',
        description:
          "User's landline number in Brazil. The phone is not required, " +
          'but if informed, it is validated according to Google rules.',
        example: '(11) 3333-4444',
      },
      password: {
        name: 'password',
        type: 'string',
        description: "User's password.",
        example: '12345',
        format: 'password',
      },
      file: {
        name: 'file',
        description: 'PDF file containing user documentation for upload.',
        type: 'string',
        format: 'binary',
      },
      token_reset: {
        name: 'token',
        description: 'User reset password token.',
        type: 'string',
        example: 'ef48e2532f535a1822e0b5df376e9f4718acfa04ed00af59ae70ad33659d',
      },
      movie_id: {
        name: 'movie_id',
        description: "The movie's primary identifier.",
        type: 'integer',
        format: 'int32',
        minimum: 1,
        example: 1,
      },
      title: {
        name: 'title',
        description: "The movie's title.",
        type: 'string',
        example: 'Jurassic Park',
      },
      director: {
        name: 'title',
        description: "The movie's director.",
        type: 'string',
        example: 'Steven Spielberg',
      },
      tape_id: {
        name: 'tape_id',
        description: 'The primary identifier of the movie tape.',
        type: 'integer',
        format: 'int32',
        minimum: 1,
        example: 1,
      },
      movies_id: {
        name: 'movies_id',
        description: "An array of movie's id.",
        type: 'array',
        items: { $ref: '#/components/requestBodies/movie_id' },
        uniqueItems: true,
        example: [1, 2, 3],
      },
      rent_id: {
        name: 'rent_id',
        description: 'The primary identifier of the movie rental.',
        type: 'integer',
        format: 'int32',
        minimum: 1,
        example: 1,
      },
      //#endregion

      //#region request bodies schemas
      auth_register: {
        type: 'object',
        required: ['cpf', 'name', 'email', 'password'],
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          password: { $ref: '#/components/requestBodies/password' },
          mobile: { $ref: '#/components/requestBodies/mobile' },
          landline: { $ref: '#/components/requestBodies/landline' },
          file: { $ref: '#/components/requestBodies/file' },
        },
      },
      auth_login: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
          password: { $ref: '#/components/requestBodies/password' },
        },
      },
      auth_reset_pass: {
        type: 'object',
        required: ['email', 'password', 'token'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
          password: { $ref: '#/components/requestBodies/password' },
          token: { $ref: '#/components/requestBodies/token_reset' },
        },
      },
      user_register: {
        type: 'object',
        required: ['email', 'mobile', 'landline'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
          mobile: { $ref: '#/components/requestBodies/mobile' },
          landline: { $ref: '#/components/requestBodies/landline' },
        },
      },
      user_email: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      user_mobile: {
        type: 'object',
        required: ['mobile'],
        properties: {
          mobile: { $ref: '#/components/requestBodies/mobile' },
        },
      },
      user_landline: {
        type: 'object',
        required: ['landline'],
        properties: {
          landline: { $ref: '#/components/requestBodies/landline' },
        },
      },
      user_name: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { $ref: '#/components/requestBodies/name' },
        },
      },
      user_file: {
        type: 'object',
        required: ['file'],
        properties: {
          file: { $ref: '#/components/requestBodies/file' },
        },
      },
      required_cpf: {
        type: 'object',
        required: ['cpf'],
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
        },
      },
      required_email: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      movie_register: {
        type: 'object',
        required: ['title', 'director'],
        properties: {
          title: { $ref: '#/components/requestBodies/title' },
          director: { $ref: '#/components/requestBodies/director' },
        },
      },
      movie_tape_register: {
        type: 'object',
        required: ['movie_id'],
        properties: {
          movie_id: { $ref: '#/components/requestBodies/movie_id' },
        },
      },
      movie_rent: {
        type: 'object',
        required: ['movies_id'],
        properties: {
          movies_ids: { $ref: '#/components/requestBodies/movies_id' },
        },
      },
      movie_return: {
        type: 'object',
        required: ['rent_id'],
        properties: {
          rent_id: { $ref: '#/components/requestBodies/rent_id' },
        },
      },
      //#endregion
    },
    parameters: {
      cpf: {
        in: 'path',
        required: true,
        name: 'cpf',
        schema: { $ref: '#/components/requestBodies/cpf' },
        description: {
          $ref: '#/components/requestBodies/cpf/description',
        },
      },
      user_category: {
        in: 'path',
        required: true,
        name: 'user_category',
        description:
          'Worker lists users according to their category: ' +
          'pf - Physical Persons (not worker), worker - Morenaas Employee, ' +
          'unchecked: Users with documentation submitted but not verified',
        schema: {
          type: 'string',
          enum: ['pf', 'worker', 'unchecked'],
        },
      },
      name_snippet: {
        in: 'query',
        name: 'name',
        schema: { type: 'string' },
        description:
          'Filters users by name snippet without case-sensitive search.',
      },
      title_snippet: {
        in: 'query',
        name: 'title',
        schema: { type: 'string' },
        description:
          'Filters movie by title snippet without case-sensitive search.',
      },
    },
    securitySchemes: {
      token: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
      },
    },
    responses: {
      //#region body response fields
      file_name: {
        name: 'file_name',
        description: 'User PDF file loaded, renamed and saved.',
        type: 'string',
        example: '12345678909_20200930211505163.pdf',
      },
      created_at: {
        name: 'created_at',
        description: 'Full date and time with timezone of creation.',
        type: 'string',
        format: 'date-time',
        example: '2020-09-30T21:15:05.163-03:00',
      },
      token_auth: {
        name: 'token',
        description: 'User authentication token.',
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcGYiOiI5NTUuOTYzLjY0MC01M' +
          'yIsIndvcmtlciI6dHJ1ZSwiY3VzdG9tZXIiOmZhbHNlLCJpYXQiOjE2MDI5ODc5Nzg' +
          'sImV4cCI6MTYwMzA3NDM3OH0.NaQJp58-x_jMlV796KWAt9uq-Qb4Vz0832ijYzfYPxk',
      },
      worker_true: {
        name: 'worker',
        description:
          'Indicates whether the user has bank employee access privilege.',
        type: 'boolean',
        example: true,
      },
      worker_false: {
        name: 'worker',
        description: { $ref: '#/components/responses/worker_true/description' },
        type: 'boolean',
        example: false,
      },
      customer: {
        name: 'customer',
        description:
          'Indicates whether the user has customer access privilege.',
        type: 'boolean',
        example: true,
      },
      alert_mobile: {
        name: 'mobile',
        type: 'string',
        description:
          'Alerts the user that the mobile phone has not been recorded ' +
          'because it is invalid.',
        example:
          "'1199998888' was not recorded because it is not a valid Brazilian " +
          'mobile phone number according to Google rules.',
      },
      alert_landline: {
        name: 'landline',
        type: 'string',
        description:
          'Alerts the user that the landline phone has not been recorded ' +
          'because it is invalid.',
        example:
          "'11333334444' was not recorded because it is not a valid Brazilian " +
          'fixed phone number according to Google rules.',
      },
      alert_file: {
        name: 'file',
        type: 'string',
        description:
          'Alerts the user that the customer access is granted ' +
          'after uploading the PDF file.',
        example:
          "You didn't upload the PDF file. Client access is " +
          'granted after sending and approving the documentation.',
      },
      movie_id: {
        name: 'id',
        description: 'The primary identifier of the movie.',
        type: 'integer',
        format: 'int32',
        minimum: 1,
        example: 1,
      },
      total_count: {
        name: 'total_count',
        type: 'integer',
        description: 'Total count of copies of a movie.',
        example: 1,
      },
      available_count: {
        name: 'available_count',
        type: 'integer',
        description: 'Count of available copies of a movie.',
        example: 1,
      },
      tape_id: {
        name: 'id',
        description: 'The primary identifier of the movie tape.',
        type: 'integer',
        format: 'int32',
        minimum: 1,
        example: 1,
      },
      available: {
        name: 'available',
        type: 'boolean',
        example: true,
      },
      rent_id: {
        name: 'id',
        description: 'The primary identifier of the rent.',
        type: 'integer',
        format: 'int32',
        minimum: 1,
        example: 1,
      },
      deadline: {
        name: 'deadline',
        description: 'Full date to return the movies without penalty.',
        type: 'string',
        format: 'date',
        example: '2020-10-01',
      },
      tapes: {
        name: 'tapes',
        description: 'Array of movie tapes rented.',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            tape_id: { $ref: '#/components/responses/tape_id' },
            movie_id: { $ref: '#/components/responses/movie_id' },
            title: { $ref: '#/components/requestBodies/title' },
            director: { $ref: '#/components/requestBodies/director' },
          },
        },
      },
      returned_at: {
        name: 'returned_at',
        description: 'Full date and time with timezone of rental return.',
        type: 'string',
        format: 'date-time',
        example: '2020-10-01T18:15:05.163-03:00',
      },
      //#endregion

      //#region response code 200
      success: {
        type: 'object',
        properties: {
          success: {
            type: 'string',
          },
        },
      },
      auth_register: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            description: "Returns the user's recorded data",
            properties: {
              cpf: { $ref: '#/components/requestBodies/cpf' },
              name: { $ref: '#/components/requestBodies/name' },
              email: { $ref: '#/components/requestBodies/email' },
              mobile: { $ref: '#/components/requestBodies/mobile' },
              landline: { $ref: '#/components/requestBodies/landline' },
              file_name: { $ref: '#/components/responses/file_name' },
              created_at: { $ref: '#/components/responses/created_at' },
              token: { $ref: '#/components/responses/token_auth' },
            },
          },
          alert: {
            type: 'object',
            description: 'Alerts the user of unsaved or unsent data',
            properties: {
              mobile: { $ref: '#/components/responses/alert_mobile' },
              landline: { $ref: '#/components/responses/alert_landline' },
              file: { $ref: '#/components/responses/alert_file' },
            },
          },
        },
      },
      auth_login: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          token: { $ref: '#/components/responses/token_auth' },
        },
      },
      user_details: {
        type: 'object',
        description: "Returns the user's details.",
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          mobile: { $ref: '#/components/requestBodies/mobile' },
          landline: { $ref: '#/components/requestBodies/landline' },
          created_at: { $ref: '#/components/responses/created_at' },
        },
      },
      user_list: {
        type: 'array',
        description: 'Returns a list of users.',
        items: { $ref: '#/components/responses/user_patch' },
      },
      user_patch: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
        },
      },
      user_mobile: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          mobile: { $ref: '#/components/requestBodies/mobile' },
        },
      },
      user_landline: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          landline: { $ref: '#/components/requestBodies/landline' },
        },
      },
      user_file: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          file_name: { $ref: '#/components/responses/file_name' },
        },
      },
      user_worker: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          worker: { $ref: '#/components/responses/worker_true' },
        },
      },
      user_worker_revoke: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          worker: { $ref: '#/components/responses/worker_false' },
        },
      },
      user_customer: {
        type: 'object',
        properties: {
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          customer: { $ref: '#/components/responses/customer' },
        },
      },
      user_register: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            description: "Returns the user's updated data",
            properties: {
              cpf: { $ref: '#/components/requestBodies/cpf' },
              name: { $ref: '#/components/requestBodies/name' },
              email: { $ref: '#/components/requestBodies/email' },
              mobile: { $ref: '#/components/requestBodies/mobile' },
              landline: { $ref: '#/components/requestBodies/landline' },
            },
          },
          alert: {
            type: 'object',
            description: 'Alerts the user of unsaved phones',
            properties: {
              mobile: { $ref: '#/components/responses/alert_mobile' },
              landline: { $ref: '#/components/responses/alert_landline' },
            },
          },
        },
      },
      movie_register: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/responses/movie_id' },
          title: { $ref: '#/components/requestBodies/title' },
          director: { $ref: '#/components/requestBodies/director' },
        },
      },
      movie_tape_register: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/responses/tape_id' },
          movie_id: { $ref: '#/components/responses/movie_id' },
          title: { $ref: '#/components/requestBodies/title' },
          director: { $ref: '#/components/requestBodies/director' },
          available: { $ref: '#/components/responses/available' },
        },
      },
      movie_rent: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/responses/rent_id' },
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          created_at: { $ref: '#/components/responses/created_at' },
          deadline: { $ref: '#/components/responses/deadline' },
          tapes: { $ref: '#/components/responses/tapes' },
        },
      },
      movie_return: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/responses/rent_id' },
          cpf: { $ref: '#/components/requestBodies/cpf' },
          name: { $ref: '#/components/requestBodies/name' },
          email: { $ref: '#/components/requestBodies/email' },
          returned_at: { $ref: '#/components/responses/returned_at' },
          tapes: { $ref: '#/components/responses/tapes' },
        },
      },
      movie_list: {
        type: 'array',
        description: 'Returns a list of movies.',
        items: {
          type: 'object',
          properties: {
            id: { $ref: '#/components/requestBodies/movie_id' },
            title: { $ref: '#/components/requestBodies/title' },
            director: { $ref: '#/components/requestBodies/director' },
            total_count: { $ref: '#/components/responses/total_count' },
            available_count: { $ref: '#/components/responses/available_count' },
          },
        },
      },
      movie_list_status: {
        type: 'object',
        properties: {
          id: { $ref: '#/components/requestBodies/movie_id' },
          title: { $ref: '#/components/requestBodies/title' },
          director: { $ref: '#/components/requestBodies/director' },
          total_count: { $ref: '#/components/responses/total_count' },
        },
      },
      //#endregion

      //#region response error
      response_error: {
        type: 'object',
        properties: {
          error: {
            description: 'The error message',
            example: 'An error has occurred',
            type: 'string',
          },
        },
      },
      //#endregion

      //#region responses code 400
      required_body: {
        value: {
          error: 'The request body must have fields informed.',
        },
      },
      required_params: {
        value: {
          error: 'The request parameters must have fields informed.',
        },
      },
      required_cpf: {
        value: {
          error:
            "The field 'cpf' is required in this request " +
            'but has been omitted.',
        },
      },
      required_email: {
        value: {
          error:
            "The field 'email' is required in this request " +
            'but has been omitted.',
        },
      },
      invalid_pdf: {
        value: {
          error: "The file 'example.doc' is not in PDF format.",
        },
      },
      invalid_cpf: {
        value: {
          error: "'123.456.789' is not a valid CPF.",
        },
      },
      invalid_email: {
        value: {
          error: "'mail.email.com' is not a valid email.",
        },
      },
      email_already_exists: {
        value: {
          error: "User with email 'mail@gmail.com' already registered.",
        },
      },
      //#endregion

      //#region response code 401
      authentication_error: {
        description: 'Unautorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            examples: {
              required_token: {
                value: {
                  error: 'No token provided.',
                },
              },
              invalid_token_parts: {
                value: {
                  error: 'Token does not have two parts.',
                },
              },
              invalid_token_prefix: {
                value: {
                  error: 'Malformed token, the prefix is ​​invalid.',
                },
              },
              rejected_token: {
                value: {
                  error: 'Token invalid, jwt expired.',
                },
              },
              replaced_token: {
                value: {
                  error:
                    'The provided token has been replaced and discontinued.',
                },
              },
            },
          },
        },
      },
      //#endregion

      //#region responses code 403
      customer_access_only: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            example: {
              error:
                'This content can only be accessed by users with customer access.' +
                ' Wait for our evaluation if have already sent your documentation.',
            },
          },
        },
      },
      user_access_only: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            example: {
              error:
                'This content can only be accessed by non-customers users. ' +
                'This change is carried out by our support team through a ticket.',
            },
          },
        },
      },
      worker_access_only: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            example: {
              error: 'This content can only be accessed by our employees.',
            },
          },
        },
      },
      //#endregion

      //#region responses code 404
      email_not_found: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            example: {
              error: "User with email 'jsilva@mail.com' not found.",
            },
          },
        },
      },
      cpf_not_found: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            example: {
              error: "User with CPF '123.456.789-09' not found.",
            },
          },
        },
      },
      //#endregion

      //#region response code 500
      unexpected_error: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/responses/response_error' },
            example: { error: 'An unexpected error has occurred.' },
          },
        },
      },
      //#endregion
    },
  },
};
