    package com.example.bldp;
    import android.os.Bundle;
    import android.view.View; // Import for View.VISIBLE and View.GONE
    import android.webkit.WebChromeClient;
    import android.webkit.WebSettings;
    import android.webkit.WebView;
    import android.webkit.WebViewClient;
    import android.widget.ProgressBar; // Import for ProgressBar

    import androidx.activity.EdgeToEdge;
    import androidx.appcompat.app.AppCompatActivity;

    public class MainActivity extends AppCompatActivity {

        private WebView webView;
        private ProgressBar progressBar;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            EdgeToEdge.enable(this);
            setContentView(R.layout.activity_main);

            // Hide the ActionBar (Navbar title)
            if (getSupportActionBar() != null) {
                getSupportActionBar().hide();
            }

            // Initialize WebView and ProgressBar
            webView = findViewById(R.id.webView);
            progressBar = findViewById(R.id.progressBar);

            // Configure WebView settings
            WebSettings webSettings = webView.getSettings();
            webSettings.setJavaScriptEnabled(true);
            webSettings.setDomStorageEnabled(true); // Enable local storage
            webSettings.setLoadWithOverviewMode(true);
            webSettings.setUseWideViewPort(true);

            // Improve performance
            webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
            webSettings.setAllowContentAccess(true);
            webSettings.setAllowFileAccess(true);

            // Handle WebView navigation
            webView.setWebViewClient(new WebViewClient());
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onProgressChanged(WebView view, int newProgress) {
                    // Show or hide the progress bar based on page load progress
                    if (newProgress < 100) {
                        progressBar.setVisibility(View.VISIBLE);
                        progressBar.setProgress(newProgress);
                    } else {
                        progressBar.setVisibility(View.GONE);
                    }
                }
            });

            // Load a webpage
            webView.loadUrl("https://banana-leaf-dp.vercel.app");
        }

        @Override
        public void onBackPressed() {
            // Handle back navigation for WebView
            if (webView.canGoBack()) {
                webView.goBack();
            } else {
                super.onBackPressed();
            }
        }
    }
