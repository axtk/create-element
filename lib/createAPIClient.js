async function resolve(response) {
    let {ok, headers, status, statusText} = response;
    let output = {status, statusText, headers};

    if (ok) {
        output.data = await response.text();
        return output;
    }
    else throw new Error(output);
}

export default ({ baseURL }) => {
    return {
        get: async path => {
            let response = await fetch(baseURL + path);

            return await resolve(response);
        },
        post: async (path, options = {}) => {
            let response = await fetch(baseURL + path, {
                method: 'POST',
                body: JSON.stringify(options.data || {}),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return await resolve(response);
        },
    };
};
