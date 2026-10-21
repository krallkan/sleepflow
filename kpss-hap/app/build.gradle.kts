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

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            // Sideload build: signed with the debug keystore so it installs directly.
            signingConfig = signingConfigs.getByName("debug")
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
