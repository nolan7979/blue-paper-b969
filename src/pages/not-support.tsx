const NotSupport = () => {
  return (
    <div style={{background: '#000'}}>
      <div
        style={{
          display: 'flex',
          height: 'calc(100vh - 3.875rem)',
          width: '100vw',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '11rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            color: '#fff',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            Unsupported browser
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6B7280',
            }}
          >
            Your browser is not supported by this application
          </p>
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src='/images/unsupported.png'
              alt='unsupported-browser'
              loading='lazy'
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.625rem',
            padding: '0.625rem',
            color: 'var(--dark-mode-text, #fff)',
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
            }}
          >
            For an optimal experience, we recommend downloading the Uniscore
            app.
          </p>
          <button
            type='button'
            style={{
              backgroundColor: '#0038E0',
              color: '#fff',
              borderRadius: '0.5rem',
              padding: '0.625rem 1.5rem',
            }}
            onClick={() => window.open('/app', '_self')}
          >
            DOWNLOAD UNISCORE
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotSupport;
