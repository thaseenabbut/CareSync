"""CareSync Backend Configuration Module.

Centralized configuration using pydantic-settings.
Securely manages environment variables without leaking secrets.
"""

from pathlib import Path
from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Root path for backend directory to locate .env file accurately
BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # API Configuration
    api_title: str = "CareSync API"
    api_version: str = "0.1.0"
    cors_origins: list[str] = ["http://localhost:5173"]

    # Gemini AI Configuration
    # Accepts GEMINI_API_KEY first, with fallback to AI_API_KEY
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    ai_api_key: str | None = Field(default=None, alias="AI_API_KEY")

    # Configurable model name suitable for current API capabilities
    gemini_model: str = Field(default="gemini-3.5-flash", alias="GEMINI_MODEL")

    # Request timeout in seconds for AI calls
    gemini_timeout_seconds: float = Field(default=15.0, alias="GEMINI_TIMEOUT_SECONDS")

    @computed_field
    @property
    def effective_gemini_api_key(self) -> str | None:
        """Returns the active key without exposing it in logs or representations."""
        return self.gemini_api_key or self.ai_api_key

    @property
    def is_gemini_configured(self) -> bool:
        """Indicates if an API key is present without disclosing the key itself."""
        return bool(self.effective_gemini_api_key)


# Singleton settings instance
settings = Settings()
