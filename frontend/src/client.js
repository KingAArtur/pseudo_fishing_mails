import config from './config';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';

const axios = require('axios');


class FastAPIClient {
  constructor(overrides) {
    this.config = {
      ...config,
      ...overrides,
    };
    this.authToken = config.authToken;

    this.login = this.login.bind(this);
    this.apiClient = this.getApiClient(this.config);
  }

  /* ----- Authentication & User Operations ----- */

  /* Authenticate the user with the backend services.
	 * The same JWT should be valid for both the api and cms */
  login(username, password) {
    delete this.apiClient.defaults.headers['Authorization'];

    // HACK: This is a hack for scenario where there is no login form
    const form_data = new FormData();
    const grant_type = 'password';
    const item = {grant_type, username, password};
    for (const key in item) {
      form_data.append(key, item[key]);
    }

    return this.apiClient
        .post('/auth', form_data)
        .then((resp) => {
          localStorage.setItem('token', JSON.stringify(resp.data));
          return this.fetchUser();
        });
  }

  fetchUser() {
    return this.apiClient.get('/users/me').then(({data}) => {
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    });
  }

  // Logging out is just deleting the jwt.
  logout() {
    // Add here any other data that needs to be deleted from local storage
    // on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /* ----- Client Configuration ----- */

  /* Create Axios client instance pointing at the REST api backend */
  getApiClient(config) {
    const initialConfig = {
      baseURL: `${config.apiBasePath}`,
    };
    const client = axios.create(initialConfig);
    client.interceptors.request.use(localStorageTokenInterceptor);
    return client;
  }

// users

  getUsers(id) {
    if (id.length > 0) {
      return this.apiClient.get(`/users?id=${id}`).then(({data}) => {
        return data;
      });
    }
    return this.apiClient.get(`/users`).then(({data}) => {
      return data;
    });
  }

  createUser(username, password, password_repeat) {
    const registerData = {
      username: username,
      password: password,
      password_repeat: password_repeat,
    };

    return this.apiClient.post('/users', registerData).then(
        (resp) => {
          return resp.data;
        });
  }

  updateUser(user_id, password, password_repeat) {
    const updateData = {
      password: password,
      password_repeat: password_repeat,
    };

    return this.apiClient.put(`/users?user_id=${user_id}`, updateData).then(
        (resp) => {
          return resp.data;
        });
  }

  deleteUser(user_id) {
    return this.apiClient.delete(`/users?user_id=${user_id}`).then(
        (resp) => {
          return resp.data;
        });
  }


// subjects

  getSubjects(id, email) {
    if (id.length > 0) {
      return this.apiClient.get(`/subjects?id=${id}`).then(({data}) => {
        return data;
      });
    }
    if (email.length > 0) {
      return this.apiClient.get(`/subjects?email=${email}`).then(({data}) => {
        return data;
      });
    }
    return this.apiClient.get(`/subjects`).then(({data}) => {
      return data;
    });

  }

  createSubject(email, last_name, first_name, patronymic) {
    const registerData = {
      email: email,
      last_name: last_name,
      first_name: first_name,
      patronymic: patronymic,
    };

    return this.apiClient.post('/subjects', registerData).then(
        (resp) => {
          return resp.data;
        });
  }

  updateSubject(id, last_name, first_name, patronymic) {
    var updateData = {
    };

    if (last_name.length > 0) {
      updateData = { ...updateData, last_name: last_name}
    }
    if (first_name.length > 0) {
      updateData = { ...updateData, first_name: first_name}
    }
    if (patronymic.length > 0) {
      updateData = { ...updateData, patronymic: patronymic}
    }

    return this.apiClient.put(`/subjects?subject_id=${id}`, updateData).then(
        (resp) => {
          return resp.data;
        });
  }

  deleteSubject(id) {
    return this.apiClient.delete(`/subjects?subject_id=${id}`).then(
        (resp) => {
          return resp.data;
        });
  }


// scheduled letters

  getSchedules(letter_id, subject_id) {
    if (letter_id.length > 0) {
      return this.apiClient.get(`/schedule?letter_id=${letter_id}`).then(({data}) => {
        return data;
      });
    }
    if (subject_id.length > 0) {
      return this.apiClient.get(`/schedule?subject_id=${subject_id}`).then(({data}) => {
        return data;
      });
    }
    return this.apiClient.get(`/schedule`).then(({data}) => {
      return data;
    });

  }

  createSchedule(subjects_id, content, send_at) {
    const registerData = {
      subjects_id: subjects_id,
      content: content,
      send_at: send_at,
    };

    return this.apiClient.post('/schedule', registerData).then(
        (resp) => {
          return resp.data;
        });
  }

  updateSchedule(letter_id, content, send_at) {
    var updateData = {
    };

    if (content.length > 0) {
      updateData = { ...updateData, content: content}
    }
    if (send_at.length > 0) {
      updateData = { ...updateData, send_at: send_at}
    }

    return this.apiClient.put(`/schedule?letter_id=${letter_id}`, updateData).then(
        (resp) => {
          return resp.data;
        });
  }

  deleteSchedule(letter_id) {
    return this.apiClient.delete(`/schedule?letter_id=${letter_id}`).then(
        (resp) => {
          return resp.data;
        });
  }


// already sent letters

  getHistories(letter_id, subject_id) {
    if (letter_id.length > 0) {
      return this.apiClient.get(`/history?letter_id=${letter_id}`).then(({data}) => {
        return data;
      });
    }
    if (subject_id.length > 0) {
      return this.apiClient.get(`/history?subject_id=${subject_id}`).then(({data}) => {
        return data;
      });
    }
    return this.apiClient.get(`/history`).then(({data}) => {
      return data;
    });

  }


// responses

  getResponses(subject_id) {
    if (subject_id.length > 0) {
      return this.apiClient.get(`/response?subject_id=${subject_id}`).then(({data}) => {
        return data;
      });
    }
    return this.apiClient.get(`/response`).then(({data}) => {
      return data;
    });

  }

  deleteResponse(response_id) {
    return this.apiClient.delete(`/response?response_id=${response_id}`).then(
        (resp) => {
          return resp.data;
        });
  }
}


// every request is intercepted and has auth header injected.
function localStorageTokenInterceptor(config) {
  const headers = {};
  const tokenString = localStorage.getItem('token');

  if (tokenString) {
    const token = JSON.parse(tokenString);
    const decodedAccessToken = jwtDecode(token.access_token);
    const isAccessTokenValid =
			moment.unix(decodedAccessToken.exp).toDate() > new Date();
    if (isAccessTokenValid) {
      headers['Authorization'] = `Bearer ${token.access_token}`;
    } else {
      alert('Your login session has expired');
    }
  }
  config['headers'] = headers;
  return config;
}

export default FastAPIClient;
