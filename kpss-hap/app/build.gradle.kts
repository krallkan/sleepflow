plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// Newest installed stable platform; CI overrides with -PcompileSdk=<n>.
val sdk = (findProperty("compileSdk") as String?)?.toInt() ?: 36

android {
    namespace = "com.taskin.kpsshap"
    compileSdk = sdk

    defaultConfig {
        applicationId = "com.taskin.kpsshap"
        minSdk = 24
        targetSdk = sdk
        versionCode = 1
        versionName = "1.0"
    }

    // Fixed key so every build (CI runners included) has the same signature;
    // otherwise Android refuses to install an update over the previous version.
    signingConfigs {
        create("kpss") {
            storeFile = rootProject.file("signing/kpsshap.jks")
            storePassword = "kpsshap123"
            keyAlias = "kpsshap"
            keyPassword = "kpsshap123"
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("kpss")
        }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("kpss")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
    }
}
