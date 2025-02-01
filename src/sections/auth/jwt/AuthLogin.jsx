// import PropTypes from 'prop-types';
// import React from 'react';
// import { Link as RouterLink, useSearchParams } from 'react-router-dom';

// // material-ui
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormHelperText from '@mui/material/FormHelperText';
// import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
// import InputAdornment from '@mui/material/InputAdornment';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// // third party
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import { preload } from 'swr';

// // project import
// import IconButton from 'components/@extended/IconButton';
// import AnimateButton from 'components/@extended/AnimateButton';

// import useAuth from 'hooks/useAuth';

// import { fetcher } from 'utils/axios';

// // assets
// import EyeOutlined from '@ant-design/icons/EyeOutlined';
// import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// // ============================|| JWT - LOGIN ||============================ //

// export default function AuthLogin({ isDemo = false }) {
//   const [checked, setChecked] = React.useState(false);

//   const { login } = useAuth();

//   const [showPassword, setShowPassword] = React.useState(false);
//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const [searchParams] = useSearchParams();
//   const auth = searchParams.get('auth'); // get auth and set route based on that

//   return (
//     <>
//       <Formik
//         initialValues={{
//           email: 'info@codedthemes.com',
//           password: '123456',
//           submit: null
//         }}
//         validationSchema={Yup.object().shape({
//           email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//           password: Yup.string()
//             .required('Password is required')
//             .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
//             .max(10, 'Password must be less than 10 characters')
//         })}
//         onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//           try {
//             const trimmedEmail = values.email.trim();
//             await login(trimmedEmail, values.password);
//             setStatus({ success: true });
//             setSubmitting(false);
//             preload('api/menu/dashboard', fetcher); // load menu on login success
//           } catch (err) {
//             console.error(err);
//             setStatus({ success: false });
//             setErrors({ submit: err.message });
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//           <form noValidate onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Stack spacing={1}>
//                   <InputLabel htmlFor="email-login">Email Address</InputLabel>
//                   <OutlinedInput
//                     id="email-login"
//                     type="email"
//                     value={values.email}
//                     name="email"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     placeholder="Enter email address"
//                     fullWidth
//                     error={Boolean(touched.email && errors.email)}
//                   />
//                 </Stack>
//                 {touched.email && errors.email && (
//                   <FormHelperText error id="standard-weight-helper-text-email-login">
//                     {errors.email}
//                   </FormHelperText>
//                 )}
//               </Grid>
//               <Grid item xs={12}>
//                 <Stack spacing={1}>
//                   <InputLabel htmlFor="password-login">Password</InputLabel>
//                   <OutlinedInput
//                     fullWidth
//                     error={Boolean(touched.password && errors.password)}
//                     id="-password-login"
//                     type={showPassword ? 'text' : 'password'}
//                     value={values.password}
//                     name="password"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     endAdornment={
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                           color="secondary"
//                         >
//                           {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                         </IconButton>
//                       </InputAdornment>
//                     }
//                     placeholder="Enter password"
//                   />
//                 </Stack>
//                 {touched.password && errors.password && (
//                   <FormHelperText error id="standard-weight-helper-text-password-login">
//                     {errors.password}
//                   </FormHelperText>
//                 )}
//               </Grid>
//               <Grid item xs={12} sx={{ mt: -1 }}>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={checked}
//                         onChange={(event) => setChecked(event.target.checked)}
//                         name="checked"
//                         color="primary"
//                         size="small"
//                       />
//                     }
//                     label={<Typography variant="h6">Keep me sign in</Typography>}
//                   />
//                   <Link
//                     variant="h6"
//                     component={RouterLink}
//                     to={isDemo ? '/auth/forgot-password' : auth ? `/${auth}/forgot-password?auth=jwt` : '/forgot-password'}
//                     color="text.primary"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </Stack>
//               </Grid>
//               {errors.submit && (
//                 <Grid item xs={12}>
//                   <FormHelperText error>{errors.submit}</FormHelperText>
//                 </Grid>
//               )}
//               <Grid item xs={12}>
//                 <AnimateButton>
//                   <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
//                     Login
//                   </Button>
//                 </AnimateButton>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Formik>
//     </>
//   );
// }

// AuthLogin.propTypes = { isDemo: PropTypes.bool };

// import PropTypes from 'prop-types';
// import React from 'react';
// import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
// import { preload } from 'swr';
// import { fetcher } from 'utils/axios';

// // material-ui
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormHelperText from '@mui/material/FormHelperText';
// import Grid from '@mui/material/Grid';
// import Link from '@mui/material/Link';
// import InputAdornment from '@mui/material/InputAdornment';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';

// // third party
// import * as Yup from 'yup';
// import { Formik } from 'formik';

// // project import
// import IconButton from 'components/@extended/IconButton';
// import AnimateButton from 'components/@extended/AnimateButton';

// // assets
// import EyeOutlined from '@ant-design/icons/EyeOutlined';
// import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
// import useAuth from 'hooks/useAuth';

// export default function AuthLogin({ isDemo = false }) {
//   const { login } = useAuth();
//   console.log('useAuth:', useAuth);
//   console.log('login function:', login);
//   const navigate = useNavigate();
//   const [checked, setChecked] = React.useState(false);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [searchParams] = useSearchParams();
//   const auth = searchParams.get('auth');

//   const handleClickShowPassword = () => setShowPassword(!showPassword);
//   const handleMouseDownPassword = (event) => event.preventDefault();
//   console.log('Token saved:', localStorage.getItem('authToken'));

//   return (
//     <Formik
//       initialValues={{
//         email: 'admin@remoteintegrity.com',
//         password: '1234',
//         submit: null
//       }}
//       validationSchema={Yup.object().shape({
//         email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
//         password: Yup.string().required('Password is required').max(10, 'Password must be less than 10 characters')
//       })}
//       onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
//         try {
//           const response = await fetch('https://gari.remoteintegrity.com/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               user_email: values.email.trim(),
//               user_password: values.password
//             })
//           });
//           const data = await response.json();

//           if (!response.ok) {
//             throw new Error(data.message || 'Login failed');
//           }

//           console.log(data, 'response');
//           setStatus({ success: true });
//           localStorage.setItem('authToken', data.token); // Store token
//           // window.location.href = 'api/menu/dashboard'; // Redirect after login
//           //window.location.href = '/dashboard'; // Redirect after login
//           //preload('api/menu/dashboard', fetcher);
//           //navigate('/dashboard/default');
//           //preload('api/menu/dashboard', fetcher); // Preload menu data

//           navigate('/dashboard');
//         } catch (err) {
//           setStatus({ success: false });
//           setErrors({ submit: err.message });
//         }
//         // setSubmitting(false);
//       }}
//     >
//       {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//         <form noValidate onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <Stack spacing={1}>
//                 <InputLabel htmlFor="email-login">Email Address</InputLabel>
//                 <OutlinedInput
//                   id="email-login"
//                   type="email"
//                   value={values.email}
//                   name="email"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   placeholder="Enter email address"
//                   fullWidth
//                   error={Boolean(touched.email && errors.email)}
//                 />
//               </Stack>
//               {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
//             </Grid>
//             <Grid item xs={12}>
//               <Stack spacing={1}>
//                 <InputLabel htmlFor="password-login">Password</InputLabel>
//                 <OutlinedInput
//                   fullWidth
//                   error={Boolean(touched.password && errors.password)}
//                   id="-password-login"
//                   type={showPassword ? 'text' : 'password'}
//                   value={values.password}
//                   name="password"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   endAdornment={
//                     <InputAdornment position="end">
//                       <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
//                         {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                       </IconButton>
//                     </InputAdornment>
//                   }
//                   placeholder="Enter password"
//                 />
//               </Stack>
//               {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
//             </Grid>
//             <Grid item xs={12}>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
//                 <FormControlLabel
//                   control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} size="small" />}
//                   label={<Typography variant="h6">Keep me signed in</Typography>}
//                 />
//                 <Link component={RouterLink} to={auth ? `/${auth}/forgot-password?auth=jwt` : '/forgot-password'}>
//                   Forgot Password?
//                 </Link>
//               </Stack>
//             </Grid>
//             {errors.submit && (
//               <Grid item xs={12}>
//                 <FormHelperText error>{errors.submit}</FormHelperText>
//               </Grid>
//             )}
//             <Grid item xs={12}>
//               <AnimateButton>
//                 <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
//                   Login
//                 </Button>
//               </AnimateButton>
//             </Grid>
//           </Grid>
//         </form>
//       )}
//     </Formik>
//   );
// }

// AuthLogin.propTypes = { isDemo: PropTypes.bool };

import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import * as Yup from 'yup';
import { Formik } from 'formik';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthLogin() {
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Formik
      initialValues={{
        email: 'admin@remoteintegrity.com',
        password: '1234',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().required('Password is required').max(10, 'Password must be less than 10 characters')
      })}
      onSubmit={async (values, { setErrors, setStatus }) => {
        try {
          const response = await fetch('https://gari.remoteintegrity.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: values.email.trim(),
              user_password: values.password
            })
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          localStorage.setItem('authToken', data.token);
          navigate('/dashboard/default');
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} size="small" />}
                label={<Typography variant="h6">Keep me signed in</Typography>}
              />
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained">
                  Login
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
